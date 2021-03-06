import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {Rectangle, selectedElementState} from './components/Rectangle/Rectangle'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'
import {EditProperties} from "./EditProperties";


export const elementsState = atom<number[]>({
    key: 'elements',
    default: []
})

function Canvas() {
    const setSelectedElement = useSetRecoilState(selectedElementState)
    const elements = useRecoilValue(elementsState)

    return (
                <PageContainer
                    onClick={() => {
                        setSelectedElement(null)
                    }}
                >
                    <EditProperties />
                    <Toolbar />
                    {elements.map((id, index) => (
                        <Rectangle key={index} id={id} />
                    ))}
                </PageContainer>
    )
}

export default Canvas