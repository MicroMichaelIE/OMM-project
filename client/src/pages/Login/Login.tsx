import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Alert } from 'react-bootstrap'

import './Login.scss'
import Divider from '../../components/Divider/Divider'

export const Login = () => {
    enum FormState {
        LOADING,
        ERROR,
        SUCCESS,
    }

    const { login, error } = useAuth()

    const [formState, setFormState] = useState(FormState.LOADING)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setFormState(FormState.LOADING)
        e.preventDefault()

        try {
            const { ok } = await login({ email, password })
            if (!ok) {
                throw new Error(error)
                setFormState(FormState.ERROR)
            } else {
                setFormState(FormState.SUCCESS)
                navigate('/login')
            }
        } catch (err) {
            if (err instanceof Error) {
                setFormState(FormState.ERROR)
            }
        }
    }

    return (
        <div className="Login mt-3">
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </Form.Group>
                <div className="d-flex justify-content-center ">
                    <Button variant="primary" type="submit" className="button">
                        Submit
                    </Button>
                </div>
            </Form>
            {formState === FormState.ERROR && (
                <Alert variant="danger">{error}</Alert>
            )}

            <Divider>Or</Divider>

            <div className="d-flex justify-content-center mt-3">
                <Button type="button" onClick={() => navigate('/signup')}>
                    Sign In
                </Button>
            </div>
        </div>
    )
}
