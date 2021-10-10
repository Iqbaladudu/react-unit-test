import React from "react";
import { render, fireEvent, waitFor, cleanup, } from "@testing-library/react";
import DisplayText from "./DisplayText";
import "@testing-library/jest-dom/extend-expect"
jest.mock('./UserTodos')
afterEach(cleanup);
describe("Test DisplayText", () => {
    const userFullname = "John Tester"
    const getUserFullnameMock = (username: string): [Promise<string>, jest.Mock<Promise<string>, [string]>] => {
        const promise = new Promise<string>((res, rej) => {
            res(userFullname)
        })
        const getUserFullname = jest.fn(
            async (username: string): Promise<string> => {
                return promise
            }
        )
        return [promise, getUserFullname]
    }
    it("Renders without crashing", () => {
        const username = "testuser"
        const [promise, getUserFullname] = getUserFullnameMock(username)
        const {baseElement} = render(<DisplayText getUserFullname={getUserFullname} />)
        expect(baseElement).toBeInTheDocument()
    })
    it("Matches snapshot", () => {
        const username = "testuser"
        const [promise, getUserFullname] = getUserFullnameMock(username)
        const {baseElement} = render(<DisplayText getUserFullname={getUserFullname} />)
        expect(baseElement).toMatchSnapshot()
    })
    it("Receive input text", () => {
        const username = "testuser"
        const [promise, getUserFullname] = getUserFullnameMock(username)
        const {getByTestId} = render(<DisplayText getUserFullname={getUserFullname} />)
        const input = getByTestId("user-input")
        fireEvent.change(input, {target: {value: username}})
        expect(input).toBeInTheDocument()
        expect(input).toHaveValue(username)
    })
    it("Shows welcome message", async () => {
        const username = "testuser"
        const [promise, getUserFullname] = getUserFullnameMock(username)
        const msg = `Welcome to React testing, ${userFullname}`
        const {getByTestId} = render(<DisplayText getUserFullname={getUserFullname} />)
        const input = getByTestId("user-input")
        const label = getByTestId("final-msg")
        fireEvent.change(input, {target: {value: username}})
        const btn = getByTestId("input-submit")
        fireEvent.click(btn)
        expect(label).toBeInTheDocument()
        await waitFor(() => promise)
        expect(label.innerHTML).toBe(msg)
    })
})