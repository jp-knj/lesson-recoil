import {useState} from "react";
import {atom, useRecoilState, useRecoilValue} from 'recoil';

const darkModeAtom = atom({
    key: 'darkMode',
    default: false
})

const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useRecoilState<boolean>(darkModeAtom)
    console.log('darkMode', darkMode)
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(ev.currentTarget.checked)
    }
    return <input type='checkbox' onChange={handleChange}/>
}

const Button = () => {
    const darkMode = useRecoilValue<boolean>(darkModeAtom)
    const color = {
        backgroundColor: darkMode ? 'black': 'white',
       color: darkMode ? 'white' : 'black'
    }
    return <button style={color}>UI button</button>
}

export  const Atoms = () => {
    return (
        <>
            <div>
                <DarkModeSwitch/>
            </div>
            <div>
                <Button />
            </div>
        </>
        )
}