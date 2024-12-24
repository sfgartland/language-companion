import { SelectionState, useSelectionStore } from "@/zustand/SelectionStore"
import { useEffect, useRef } from "react"

export const useSelectionDetector = () => {
    const setText = useSelectionStore((state: SelectionState) => state.setText)
    const timer = useRef<ReturnType<typeof setTimeout>>()
  
    const handleSelection = (selection: Selection | null) => {
      if (!selection) return null
  
      const text = selection.toString()
  
      if (text == '') return null
      else setText(text)
    }
  
    useEffect(() => {
      document.addEventListener('selectionchange', () => {
        clearTimeout(timer.current)
  
        const selection = document.getSelection()
  
        timer.current = setTimeout(() => handleSelection(selection), 500)
      })
  
      return () => {
        clearTimeout(timer.current)
      }
    }, [])
  }