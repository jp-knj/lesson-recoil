import {useState} from "react";

const DarkModeSwitch = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false)
    console.log('darkMode', darkMode)
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(ev.currentTarget.checked)
    }
    return <input type='checkbox' onChange={handleChange}/>
}
const Button = () => {
    return <button>UI button</button>
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