import { Center, Container, Pagination, Skeleton, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import Service from '../Components/Service/http';
import { useQuery } from '@tanstack/react-query';
import ErrorPage from '../Components/UtilComponents/ErrorPage';
const service = new Service();

const getReports = async (page: number, limit: number) => {
    return await service.get(`/api/plagiarism/report?page=${page}&limit=${limit}`);
};

export default function MyReport() {
    const limit = 10;
    const [total, setTotal] = useState(1);
    const [activePage, setPage] = useState(1);

    const { isLoading, isError, data, isSuccess } = useQuery({
        queryKey: ['reports', activePage, limit],
        queryFn: () => getReports(activePage, limit),
    });

    useEffect(() => {
        if (data?.data?.docs) {
            setTotal(data?.data?.totalPages);
        }
    }, [data, isSuccess]);

    if (isError) {
        return <ErrorPage />;
    }

    const rows = data?.data?.docs?.map((element: any, index: number) => (
        <Table.Tr key={index}>
            <Table.Td>{element.language}</Table.Td>
            <Table.Td>{new Date(element.createdAt).toLocaleString()}</Table.Td>
            <Table.Td>{element.resultUrl}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size={'lg'}>
            {isLoading && (
                <Skeleton height={'80vh'} visible={isLoading}>
                    <Center m={'xl'}> Under Construction... </Center>
                </Skeleton>
            )}
            <Table horizontalSpacing="xl" verticalSpacing="lg" highlightOnHover={true}>
                <Table.Thead m="xl">
                    <Table.Tr>
                        <Table.Th>Language</Table.Th>
                        <Table.Th>Created At</Table.Th>
                        <Table.Th>Result</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Pagination m="xl" value={activePage} onChange={setPage} total={total} />
        </Container>
    );
}
