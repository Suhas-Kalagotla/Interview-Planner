import { Link, useParams } from 'react-router-dom';
import Service from '../Components/Service/http';
import { useQuery } from '@tanstack/react-query';
import ErrorPage from '../Components/UtilComponents/ErrorPage';
import { Center, Container, Skeleton, Table } from '@mantine/core';
const service = new Service();


const getPlan = async (id:string) => {
  return await service.get(`/api/plagiarism/${id}`);
};


export default function Plan() {
  const { id } = useParams();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => getPlan(id??""),
});

if (isError) {
  return <ErrorPage />;
}

const rows = data?.data?.data?.map((element: any, index: number) => (
  <Table.Tr key={index}>
    <Table.Td>{index+1}</Table.Td>
    <Table.Td>
    <Link 
                to={`/plan/${element.source}`}
                target="_blank" 
                rel="noopener noreferrer"
                >{element.name}
                
                </Link>
    </Table.Td>
    <Table.Td>{element.topic}</Table.Td>
    <Table.Td>{element.companies.join(', ')}</Table.Td>
  </Table.Tr>
));

  return (
    <Container size={'lg'}>
    {isLoading ? (
      <Skeleton height={'80vh'} visible={isLoading}>
        <Center m={'xl'}>Loading...</Center>
      </Skeleton>
    ) : (
      <Table horizontalSpacing="xl" verticalSpacing="lg" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
          <Table.Th>S.No</Table.Th>
            <Table.Th>Problem Name</Table.Th>
            <Table.Th>Topic</Table.Th>
            <Table.Th>Companies</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    )}
    
  </Container>
  )
}
