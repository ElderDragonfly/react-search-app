import {describe, it, expect} from 'vitest'
import {ApiError, handleError} from './ApiError'
import randomInt from '../../utils/randomazer'

describe(handleError, ()=> {
    it("handles 404 error", ()=> {
        const error = new ApiError(404, 'Not found');
        const result = handleError(error);
        expect(result).toEqual({status: 404, message: 'Sorry, we couldn’t find anything :('})
    })
    it("handles 4xx errors exclude 404", ()=> {
        const randomNumber = randomInt(400, 499, 404);
        const error = new ApiError(randomNumber, "")
        const result = handleError(error);
        expect(result).toEqual(
            {status: randomNumber, message: "We couldn’t process your request. Please try again."}
        )
    })
})

