import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import useAuth from '../../hooks/useAuth'
import { Alert } from 'react-bootstrap'
import Divider from '../../components/Divider/Divider'

import './SignUp.scss'

export const SignUp = () => {
    enum FormState {
        LOADING,
        ERROR,
        SUCCESS,
    }

    const { signUp, error } = useAuth()

    const [formState, setFormState] = useState(FormState.LOADING)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Submit')
        setFormState(FormState.LOADING)
        try {
            const { ok } = await signUp({ email, password }, confirmPassword)
            console.log(ok)
            if (!ok) {
                console.log('im tring to throw an error')
                setFormState(FormState.ERROR)
            } else {
                setFormState(FormState.SUCCESS)
                navigate('/')
            }
        } catch (err) {
            setFormState(FormState.ERROR)
        }
    }

    return (
        <div className="SignUp mt-3">
            <h1>Sign Up</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        value={email}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        value={password}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setConfirmPassword(e.target.value)
                        }
                        value={confirmPassword}
                        required
                    />
                </Form.Group>
                {formState === FormState.ERROR && (
                    <Alert
                        variant="danger"
                        show={formState === FormState.ERROR}
                    >
                        {error}
                    </Alert>
                )}
                <div className="d-flex justify-content-center">
                    <Button
                        variant="primary"
                        type="submit"
                        className={`button text-center`}
                    >
                        Submit
                    </Button>
                </div>
            </Form>

            <Divider> OR </Divider>
            <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/sign-in')}
            >
                Sign In
            </Button>
        </div>
    )
}
