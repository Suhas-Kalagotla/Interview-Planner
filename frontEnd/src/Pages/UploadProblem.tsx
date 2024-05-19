import {
    Container,
    MultiSelect,
    Box,
    TextInput,
    Group,
    List,
    Text,
    ThemeIcon,
    rem,
    Center,
    Stack,
    Button,
} from '@mantine/core';
import { NativeSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDownload, IconFileCv, IconPoint } from '@tabler/icons-react';
import { useState } from 'react';
import Service from '../Components/Service/http';
import * as XLSX from 'xlsx';
import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import LoadingPage from '../Components/UtilComponents/LoadingPage';
import ErrorPage from '../Components/UtilComponents/ErrorPage';
import { Link } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '../Utils/Constant';

const service = new Service();

const uploadDataPlagiarism = async (data: any) => {
    return await service.post('/api/plagiarism/run', data);
};

const UploadProblem = () => {
    const [jsonData, setJsonData] = useState<any[] | null>(null);
    const [responseData, setResponseData] = useState(null);
    const [language, setLanguage] = useState<any>(SUPPORTED_LANGUAGES[0]);
    const icon = <IconFileCv style={{ width: rem(19), height: rem(18) }} stroke={1.5} />;

    const handleFileUpload = async (file: File | null) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = e?.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheet_name_list = workbook.SheetNames;
                    const json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                    setJsonData(json_data);
                }
            };

            reader.readAsBinaryString(file);
        }
    };

    const uploadDataMutation = useMutation({
        mutationFn: uploadDataPlagiarism,
        onSuccess: (data: any) => {
            setResponseData(data?.result);
            showNotification({
                title: 'Success',
                message: 'Data uploaded successfully',
                color: 'green',
            });
        },
        onError: (error: any) => {
            showNotification({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to upload data',
                color: 'red',
            });
        },
    });

    const uploadDataToBackend = () => {
        if (jsonData) {
            uploadDataMutation.mutate({ jsonData, language });
        } else {
            console.error('No data to upload');
        }
    };

    if (uploadDataMutation.isPending) {
        return <LoadingPage />;
    }

    if (uploadDataMutation.isError) {
        return <ErrorPage />;
    }

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            topic: '',
            company: [],
            importance: 'one',
            source: '',
            newSolve: 0,
            solved: 0,
            read: 0,
        },

        validate: {
            name: (value) => (value.length < 4 ? 'Invalid Name' : null),
            topic: (value) => (value.length < 4 ? 'Invalid Name' : null),
            company: (value) => (value.length == 0 ? 'Invalid Name' : null),
            source: (value) => (value.length < 4 ? 'Invalid Name' : null),
            newSolve: (value) => (value <= 0 ? "Time can't less than equal to zero" : null),
            solved: (value) => (value <= 0 ? "Time can't less than equal to zero" : null),
            read: (value) => (value <= 0 ? "Time can't less than equal to zero" : null),
            importance: (value) => (value == '' ? 'Invalid Value' : null),
        },
    });
    const handleSubmit = async (values: typeof form.values) => {
        try {
            const data = await uploadDataPlagiarism(values);
            console.log(data);
        } catch (error) {
            console.error('Error uploading data :', error);
        }
    };

    return (
        <Container size="md" p="md" my="xl">
            <List
                spacing="lg"
                size="md"
                icon={
                    <ThemeIcon color="teal" size={20} radius="xl">
                        <IconPoint />
                    </ThemeIcon>
                }
            >
                <List.Item>Ensure all required fields are filled out</List.Item>
                <List.Item>Verify that the URL for the problem is correct</List.Item>
                <List.Item>List the companies that have previously asked this problem</List.Item>
                <List.Item>Specify the topic to which the problem belongs</List.Item>
                <List.Item>Significance of the problem</List.Item>
                <List.Item>
                    Include the average time to solve the problem based on three factors
                    <ul>
                        <li>If the user has already sovled the problem </li>
                        <li>If the user knows the problem but hasn't solved it</li>
                        <li>If the user is solving it for the first time</li>
                    </ul>
                </List.Item>
            </List>
            <Group justify="left" m={'xl'}>
                <Link
                    className="float-start"
                    to="/samplePlagiarismDataUpload.xlsx"
                    target="_blank"
                    download
                ></Link>
            </Group>
            {
                //           <IconDownload color="black" />
                //            <Text> Download sample formate sheet </Text>
                //            <Group justify="left" m={'xl'}>
                //                <FileInput
                //                    accept=".xlsx,.xls"
                //                    rightSection={icon}
                //                    placeholder="Your Document with"
                //                    rightSectionPointerEvents="none"
                //                    onChange={handleFileUpload}
                //                />
                //                <Select
                //                    placeholder="Pick Language"
                //                    data={SUPPORTED_LANGUAGES}
                //                    defaultValue={language}
                //                    onChange={setLanguage}
                //                />
                //                <Button
                //                    variant="filled"
                //                    onClick={uploadDataToBackend}
                //                    disabled={!jsonData || !language} // Disable the button if jsonData is null
                //                >
                //                    Upload & Run Plagiarism
                //                </Button>
                //            </Group>
                //
                //            {responseData && (
                //                <Center>
                //                    <Text
                //                        fw={700}
                //                        variant="gradient"
                //                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                //                    >
                //                        {' '}
                //                        Result : {responseData}{' '}
                //                    </Text>
                //                </Center>
                //            )}
            }
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack
                    style={{ border: '1px solid', padding: '1.5rem', borderRadius: '0.5rem' }}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="center"
                    gap="md"
                >
                    <Group justify="space-between">
                        <Group>
                            <p>Topic</p>
                            <TextInput
                                required
                                placeholder="Topic Name"
                                {...form.getInputProps('topic')}
                            />
                            <Group>
                                <p>Company</p>
                                <MultiSelect
                                    placeholder="Select"
                                    data={[
                                        'Apple',
                                        'Google',
                                        'Nvidia',
                                        'Microsoft',
                                        'Amazon',
                                        'Meta',
                                        'Samsung',
                                        'Netflix',
                                    ]}
                                    {...form.getInputProps('company')}
                                />
                            </Group>
                        </Group>
                    </Group>
                    <Group>
                        <p>Importance</p>
                        <Box style={{ alignItems: 'center', width: '50%' }}>
                            <NativeSelect
                                aria-placeholder="Importance of the question"
                                data={[
                                    'one',
                                    'two',
                                    'three',
                                    'four',
                                    'five',
                                    'six',
                                    'seven',
                                    'eight',
                                    'nine',
                                    'ten',
                                ]}
                                {...form.getInputProps('importance')}
                            />
                        </Box>
                    </Group>
                    <Group>
                        <p>Problem</p>
                        <Box style={{ alignItems: 'center' }}>
                            <TextInput
                                placeholder="name of the Problem"
                                {...form.getInputProps('name')}
                            />
                        </Box>
                        <p>Source</p>
                        <Box style={{ alignItems: 'center', width: '50%' }}>
                            <TextInput
                                placeholder="Source of the Problem"
                                {...form.getInputProps('source')}
                            />
                        </Box>
                    </Group>
                    <p>Time to solve in minutes</p>
                    <Group>
                        <Group>
                            <p>First Time solving</p>
                            <TextInput placeholder="Time" {...form.getInputProps('newSolve')} />
                        </Group>
                        <Group>
                            <p>Know about the question</p>
                            <TextInput placeholder="Time" {...form.getInputProps('solved')} />
                        </Group>
                        <Group>
                            <p>Already solved</p>
                            <TextInput placeholder="Time" {...form.getInputProps('read')} />
                        </Group>
                    </Group>
                    <Button type="submit">Create</Button>
                </Stack>
            </form>
        </Container>
    );
};

export default UploadProblem;
