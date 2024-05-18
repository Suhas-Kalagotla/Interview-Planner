import {
    Center,
    Container,
    FileInput,
    Group,
    List,
    Select,
    Text,
    ThemeIcon,
    rem,
} from '@mantine/core';
import { IconDownload, IconFileCv, IconPoint } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@mantine/core';
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
    const icon = (
        <IconFileCv style={{ width: rem(19), height: rem(18) }} stroke={1.5} />
    );

    const handleFileUpload = async (file: File | null) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = e?.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheet_name_list = workbook.SheetNames;
                    const json_data = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheet_name_list[0]],
                    );
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
                message:
                    error?.response?.data?.message || 'Failed to upload data',
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
                <List.Item>
                    Ensure completion of three mandatory fields: "username",
                    "filename", and "code".
                </List.Item>
                <List.Item>
                    Assign a unique identifier or ID to the author within the
                    "username" field.
                </List.Item>
                <List.Item>
                    The "filename" field must follow specific guidelines:
                    <ul>
                        <li>
                            It should include an extension such as "example.cpp"
                            or "Main.java".
                        </li>
                        <li>
                            Each filename must be distinct. Employ the format
                            "codeId.extension" for uniqueness.
                        </li>
                    </ul>
                </List.Item>
                <List.Item>
                    Users are prompted to download the provided sample input,
                    complete the requisite details, and upload it for plagiarism
                    detection.
                </List.Item>
            </List>
            <Group justify="left" m={'xl'}>
                <Link
                    className="float-start"
                    to="/samplePlagiarismDataUpload.xlsx"
                    target="_blank"
                    download
                >
                    <IconDownload color='black' />
                </Link>
                <Text> Download sample formate sheet </Text>
            </Group>
            <Group justify="left" m={'xl'}>
                <FileInput
                    accept=".xlsx,.xls"
                    rightSection={icon}
                    placeholder="Your Document with"
                    rightSectionPointerEvents="none"
                    onChange={handleFileUpload}
                />
                <Select
                    placeholder="Pick Language"
                    data={SUPPORTED_LANGUAGES}
                    defaultValue={language}
                    onChange={setLanguage}
                />
                <Button
                    variant="filled"
                    onClick={uploadDataToBackend}
                    disabled={!jsonData || !language} // Disable the button if jsonData is null
                >
                    Upload & Run Plagiarism
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

export default UploadProblem;
