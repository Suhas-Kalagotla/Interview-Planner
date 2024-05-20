import { Center, Container, Group, Pagination, Skeleton, Table } from '@mantine/core';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import Service from '../Components/Service/http';
import { useQuery } from '@tanstack/react-query';
import ErrorPage from '../Components/UtilComponents/ErrorPage';
import { Checkbox } from '@mantine/core';
const service = new Service();

const getProblems = async (page: number, limit: number) => {
    return await service.get(`/api/plagiarism/problems?page=${page}&limit=${limit}`);
};

export default function AllProblems() {
    const limit = 10;
    const [total, setTotal] = useState(1);
    const [activePage, setPage] = useState(1);
    const { isLoading, isError, data, isSuccess } = useQuery({
        queryKey: ['problems', activePage, limit],
        queryFn: () => getProblems(activePage, limit),
    });

    useEffect(() => {
        if (data?.data?.docs) {
            console.log(data.data);
            setTotal(data?.data?.totalPages);
        }
    }, [data, isSuccess]);

    if (isError) {
        return <ErrorPage />;
    }

    const rows = data?.data?.docs?.map((element: any, index: number) => {
        const timeToSolve = element.timeToSolve;
        const companies = element.companies;
        const selectTime = Object.entries(timeToSolve).map(
            ([key, value]) => `${key} : ${value} minutes`,
        );
        return (
            <Table.Tr key={index}>
                <Table.Td>
                    <Checkbox />
                </Table.Td>
                <Table.Td>{element.topic}</Table.Td>
                <Table.Td>{element.importance}</Table.Td>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>{element.source}</Table.Td>
                <Table.Td>
                    <Select
                        placeholder="Pick value"
                        data={selectTime}
                        defaultValue={selectTime[0]}
                        clearable
                    />
                </Table.Td>
                <Table.Td>
                    <Group gap="xs" style={{ display: 'flex' }}>
                        {companies.map((company: any, idx: any) => (
                            <p style={{ display: 'inline-block', margin: '0' }} key={idx}>
                                {company}
                            </p>
                        ))}
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Container size={'xl'}>
            {isLoading && (
                <Skeleton height={'80vh'} visible={isLoading}>
                    <Center m={'xl'}> Under Construction... </Center>
                </Skeleton>
            )}
            <Table horizontalSpacing="xl" verticalSpacing="lg" highlightOnHover={true}>
                <Table.Thead m="xl">
                    <Table.Tr>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Topic</Table.Th>
                        <Table.Th>Importance</Table.Th>
                        <Table.Th>Problem</Table.Th>
                        <Table.Th>Source</Table.Th>
                        <Table.Th>Time To Solve</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            <Pagination m="xl" value={activePage} onChange={setPage} total={total} />
        </Container>
    );
}
