import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selector, useRecoilValue} from 'recoil'
import {selectedElementState, elementState} from "./components/Rectangle/Rectangle";

const selectedElementProperties = selector({
    key: 'selectedElementProperties',
    get:({get}) => {
        const selectedElementId = get(selectedElementState)
        if (selectedElementId === null) return

        return get(elementState(selectedElementId))
    }
})

export const EditProperties = () => {
    const element = useRecoilValue(selectedElementProperties)
    console.log(element)
    if(!element) return null

    return (
        <Card>
            <Section heading="Position">
                <Property label="Top" value={element.position.top} onChange={(top) => {}} />
                <Property label="Left" value={1} onChange={(left) => {}} />
            </Section>
        </Card>
    )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

const Property = ({label, value, onChange}: {label: string; value: number; onChange: (value: number) => void}) => {
    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => onChange(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

const Card: React.FC = ({children}) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)