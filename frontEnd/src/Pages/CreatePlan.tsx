import {
  Center,
  Container,
  Group,
  Input,
  List,
  MultiSelect,
  NumberInput,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { IconPoint } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@mantine/core';
import Service from '../Components/Service/http';
import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import LoadingPage from '../Components/UtilComponents/LoadingPage';
import ErrorPage from '../Components/UtilComponents/ErrorPage';
import { SUPPORTED_COMPANIES, SUPPORTED_TOPICS } from '../Utils/Constant';
import { useNavigate } from 'react-router-dom';

const service = new Service();

const uploadDataPlagiarism = async (data: any) => {
  return await service.post('/api/plagiarism/plan', data);
};

const CreatePlan = () => {
  const [responseData, setResponseData] = useState(null);
  const [companies, setCompanies] = useState<any>();
  const [numberOfDays, setNumberOfDays] = useState<any>(30);
  const [numberOfHours, setNumberOfHours] = useState<any>(2);
  const [planName, setPlanName] = useState<any>("My Plan");
  const [topics, setTopics] =  useState<any>();
  const navigate = useNavigate();



  const uploadDataMutation = useMutation({
      mutationFn: uploadDataPlagiarism,
      onSuccess: (data: any) => {
          setResponseData(data);
          console.log(data);
          navigate(`/plan/${data.savePlan._id}`);
          showNotification({
              title: 'Success',
              message: 'Data uploaded successfully',
              color: 'green',
          });
      },
      onError: (error: any) => {
          showNotification({
              title: 'Error',
              message:
                  error?.response?.data?.message || 'Failed to upload data',
              color: 'red',
          });
      },
  });

  const uploadDataToBackend = () => {
          uploadDataMutation.mutate({ planName, numberOfHours, numberOfDays, companies, topics });
  };

  if (uploadDataMutation.isPending) {
      return <LoadingPage />;
  }

  if (uploadDataMutation.isError) {
      return <ErrorPage />;
  }

  return (
      <Container size="md" p="md" my="xl">
          <List spacing="lg" size="md" icon={ <ThemeIcon color="teal" size={20} radius="xl"> <IconPoint /> </ThemeIcon>}>
              <List.Item>
                  Generate personalized plan to prepare for interview based on companies, preparation time and topic.
              </List.Item>
              <List.Item>
                  Generated plan updates dynamically based on the pace problems are solved.
              </List.Item>
              
          </List>


      <Group justify="left"  grow style={{ marginTop: '100px', marginBottom: '30px' }}>
        <TextInput 
            description="Name your plan"
            onChange={(data)=>{
              setPlanName(data.target.value);
            }}
            defaultValue={"My Plan"}
        />
        <NumberInput
          description="Number of days"
          onChange={setNumberOfDays}
          defaultValue={30}
        />
        <NumberInput
          description="Number of hours each day"
          onChange={setNumberOfHours}
          defaultValue={2}
        />
      </Group>
      <Group justify="left" grow style={{ marginBottom: '100px' }}>
        <MultiSelect
          placeholder='Pick Companies'
          description="Pick Companies"
          data={SUPPORTED_COMPANIES}
          onChange={setCompanies}

        />
        <MultiSelect
          placeholder='Pick Topics'
          description="Pick Topics"
          data={SUPPORTED_TOPICS}
          onChange={setTopics}
        />
        
      </Group>
      <Group justify="flex-end"  m={'xl'}>
      <Button
          variant="filled"
          onClick={uploadDataToBackend}
          disabled={!companies} // Disable the button if jsonData is null
        >
          Generate Plan
        </Button>
    </Group>
      

          {responseData && (
              <Center>
                  <Text
                      fw={700}
                      variant="gradient"
                      gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                  >
                      {' '}
                      Result : {responseData}{' '}
                  </Text>
              </Center>
          )}
      </Container>
  );
};

export default CreatePlan;
