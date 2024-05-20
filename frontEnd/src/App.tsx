import '@mantine/core/styles.css';
import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu';
import LoadingPage from './Components/UtilComponents/LoadingPage';
const Login = React.lazy(() => import('./Pages/Login'));
const Home = React.lazy(() => import('./Pages/Home'));
const User = React.lazy(() => import('./Pages/User'));
const UploadProblem = React.lazy(() => import('./Pages/UploadProblem'));
const AllProblems = React.lazy(() => import('./Pages/AllProblems'));
const MyPlan = React.lazy(() => import('./Pages/MyPlan'));

function App() {
    return (
        <MantineProvider>
            <Router>
                <HeaderMegaMenu />
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                {' '}
                                <Login />{' '}
                            </Suspense>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                {' '}
                                <Home />{' '}
                            </Suspense>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                {' '}
                                <User />{' '}
                            </Suspense>
                        }
                    />
                    <Route
                        path="/upload/problem"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                {' '}
                                <UploadProblem />{' '}
                            </Suspense>
                        }
                    />
                    <Route
                        path="/problems"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                {' '}
                                <AllProblems />{' '}
                            </Suspense>
                        }
                    />
                    <Route
                        path="/my/plan"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                {' '}
                                <MyPlan />{' '}
                            </Suspense>
                        }
                    />
                </Routes>
            </Router>
        </MantineProvider>
    );
}

export default App;
