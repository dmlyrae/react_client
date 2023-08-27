import { useState, ChangeEvent } from "react";

export const useForm = function(inputValues = {}) {

    const [values, setValues] = useState<Record<string, string>>(inputValues)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setValues({...values, [name]: value})
    }

    const changeValue = function(name: string) {
        return function(value: string) {
            setValues( prevState => {
                prevState[name] = value;
                return prevState;
            })
        }
    }

    return { values, handleChange, changeValue }
}