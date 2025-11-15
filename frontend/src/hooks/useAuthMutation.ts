import {useState } from 'react';

interface MutationState<T>{
    data: T | null;
    isLoading: boolean;
    error: string | null;
}


//@param {Function} mutationFn
export const useAuthMutation = <T, V>(mutationFn: (variables: V) => Promise<T>) =>{
    const [state, setState] = useState<MutationState<T>>({
        data:null,
        isLoading: false,
        error:null,
    });

const execute = async (variables: V) => {
    setState({ data:null, isLoading:true, error: null})
        try{
            const result = await mutationFn(variables);
            setState({data:result, isLoading: false, error: null});
            return result;
        }catch (err: any){
            const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
            setState({data:null, isLoading: false, error: errorMessage});
            throw new Error(errorMessage);
        }
    };
    return {...state, execute}
};
