import {
    Box,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Icon,
    NumberInput,
    NumberInputField,
    Switch,
} from '@chakra-ui/react'
import {ArrowRight} from 'react-feather'
import {atom, selector, useRecoilState} from "recoil";

const exchangeRate = 0.83

const usdAtom = atom({
    key: 'usd',
    default: 1,
})

const eurSelector = selector<number>({
    key: 'eur',
    get: ({get}) => {
        const usd = get(usdAtom)
        return usd * exchangeRate
    },
    set: ({set}, newEurValue) => {
        // @ts-ignore
        const newUsdValue = newEurValue / exchangeRate
        set(usdAtom, newUsdValue)
    }
})

export const Selectors = () => {
    const [usd, setUSD] = useRecoilState(usdAtom)
    const [eur, setEur] = useRecoilState(eurSelector)

    return (
        <div style={{padding: 20}}>
            <Heading size="lg" mb={2}>
                Currency converter
            </Heading>
            <InputStack>
                <CurrencyInput label="usd" amount={usd}  onChange={(usd)=> setUSD(usd)}/>
                <CurrencyInput label="eur" amount={eur}  onChange={(eur) => setEur(eur)} />
            </InputStack>
            <Commission />
        </div>
    )
}

// You can ignore everything below this line.
// It's just a bunch of UI components that we're using in this example.

const InputStack: React.FC = ({children}) => {
    return (
        <HStack
            width="300px"
            mb={4}
            spacing={4}
            divider={
                <Box border="0 !important" height="40px" alignItems="center" display="flex">
                    <Icon as={ArrowRight} />
                </Box>
            }
            align="flex-end"
        >
            {children}
        </HStack>
    )
}

const CurrencyInput = ({amount, onChange, label,}: { label: string, amount: number, onChange?: (amount: number) => void }) => {
    let symbol = label === 'usd' ? '$' : '€'

    const handleChange = (value:string) => {
        const withoutSymbol = value.split(' ')[0]
        onChange?.(parseFloat(withoutSymbol || '0'))
    }

    return (
        <FormControl id={label.toUpperCase()}>
            <FormLabel>{label.toUpperCase()}</FormLabel>
            <NumberInput
                value={`${symbol} ${amount}`}
                onChange={handleChange}
            >
                <NumberInputField />
            </NumberInput>
        </FormControl>
    )
}


const Commission = () => {
    return (
        <Box width="300px">
            <FormControl display="flex" alignItems="center" mb={2}>
                <FormLabel htmlFor="includeCommission" mb="0">
                    Include forex commission?
                </FormLabel>
                <Switch
                    id="includeCommission"
                />
            </FormControl>
            <NumberInput>
                <NumberInputField />
            </NumberInput>
        </Box>
    )
}

// const addCommission = (amount: number, commission: number) => {
//     return amount / (1 - commission / 100)
// }

// const removeCommission = (amount: number, commission: number) => {
//     return amount * (1 - commission / 100)
// }