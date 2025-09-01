import { useState } from 'react';

export default function useTarea() {
    const [descripcion, setDescripcion] = useState("");
    const [prioridad, setPrioridad] = useState("Media");
    const [categoria, setCategoria] = useState("Trabajo");

    const setDato = (campo, valor) => {
        switch (campo){
         case 'descripcion':
             setDescripcion(valor);
         break;
         case 'prioridad':
                setPrioridad(valor);
         break;
         case 'categoria':
                setCategoria(valor);
         break;
         default:
         break;
        }
    }

    return [{descripcion, prioridad, categoria}, setDato];
}