import { Center, Loader } from '@mantine/core'

function LoadingPage() {
    return (
        <Center style={{
            height: '60vh',
        }}>
            <Loader size={'xl'} />
        </Center>
    )
}

export default LoadingPage