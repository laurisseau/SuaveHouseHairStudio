import NavbarComp from "../components/NavbarComp";
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signup', {
        firstname,
        lastname,
        email,
        number,
        password,
        confirmPassword
      });
     
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      if(data){
        navigate(redirect || '/');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (

    <div>
        <NavbarComp color="dark" />
        <Container className="small-container">
        <Helmet>
            <title>Sign Up</title>
        </Helmet>
        <h1 className="my-3">Sign Up</h1>
        <Form onSubmit={submitHandler}>

            <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>FirstName</Form.Label>
            <Form.Control
                type="firstname"
                required
                onChange={(e) => setFirstname(e.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
                type="lastname"
                required
                onChange={(e) => setLastname(e.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="number">
            <Form.Label>Number</Form.Label>
            <Form.Control
                type="number"
                required
                onChange={(e) => setNumber(e.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
                type="password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </Form.Group>

            <div className="mb-3">
            <Button type="submit">Sign Up</Button>
            </div>
            <div className="mb-3">
            Already have an account?{' '}
            <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
            </div>
        </Form>
        </Container>
    </div>
  );
}