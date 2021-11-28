import {createContext, useState} from 'react'
import {atom, useSetRecoilState} from "recoil";
import {Element, Rectangle} from './components/Rectangle/Rectangle'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'

type ElementsContextType = {
    elements: Element[]
    addElement: () => void
    setElement: SetElement
}

export const ElementsContext = createContext<ElementsContextType>({
    elements: [],
    addElement: () => {},
    setElement: () => {},
})

type SelectedElementContextType = {
    selectedElement: number | null
    setselectedelement: (index:number) => void
}

export const selectedElementState = atom<number | null>({
    key: 'selectedElement',
    default: null
})

export type SetElement = (indextoset: number, newelement: Element) => void

function Canvas() {
    const [elements, setElements] = useState<Element[]>([])
    const [selectedelement, setselectedelement] = useState<number | null>(null)

    const setElement: SetElement = (indexToSet, newElement) => {
        setElements(
            elements.map((element, index) => {
                if (indexToSet === index) return newElement
                return element
            }),
        )
    }

    const addElement = () => {
        setElements((elements) => {
            return [
                ...elements,
                {
                    style: {
                        position: {top: 100 + elements.length * 30, left: 100 + elements.length * 30},
                        size: {width: 100, height: 100},
                    },
                },
            ]
        })
    }

    const setSelectedElement = useSetRecoilState(selectedElementState)

    return (
            <ElementsContext.Provider value={{elements, addElement, setElement}}>
                <PageContainer
                    onClick={() => {
                        setSelectedElement(null)
                    }}
                >
                    <Toolbar />
                    {elements.map((element, index) => (
                        <Rectangle key={index} element={element} index={index} />
                    ))}
                </PageContainer>
            </ElementsContext.Provider>
    )
}

export default Canvas