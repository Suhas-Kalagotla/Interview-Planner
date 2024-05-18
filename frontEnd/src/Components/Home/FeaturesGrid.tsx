import {
    ThemeIcon,
    Text,
    Title,
    Container,
    SimpleGrid,
    rem,
} from '@mantine/core';
import {
    IconCode,
    IconCoin,
    IconBook,
    IconFingerprint,
    IconChartPie3,
    IconNotification,
} from '@tabler/icons-react';
import classes from './FeaturesGrid.module.css';

export const MOCKDATA = [
    {
        icon: IconCode,
        title: 'Upload and Check',
        link: '/upload/doc',
        description:
            'Upload your CPP, Java, Python, Node.js, and more files for plagiarism detection.',
    },
    {
        icon: IconCoin,
        title: 'Free for Everyone',
        link: '#',
        description: 'Plagiarism detection service is free for all users.',
    },
    {
        icon: IconBook,
        title: 'Comprehensive Analysis',
        link: '#',
        description:
            'Receive detailed reports on similarities and originality of your code.',
    },
    {
        icon: IconFingerprint,
        title: 'Secure Processing',
        link: '#',
        description: 'Your uploaded code is securely processed and analyzed.',
    },
    {
        icon: IconChartPie3,
        title: 'Analytics',
        link: '#',
        description:
            'Gain insights into code similarity trends across different programming languages.',
    },
    {
        icon: IconNotification,
        title: 'Instant Notifications',
        link: '#',
        description:
            'Get notified instantly upon completion of plagiarism checks.',
    },
];

interface FeatureProps {
    icon: React.FC<any>;
    title: React.ReactNode;
    description: React.ReactNode;
    link: string;
}

export function Feature({ icon: Icon, title, description, link }: FeatureProps) {
    return (
        <div>
            <ThemeIcon variant="gradient" size={40} radius={40}>
                <Icon
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                />
            </ThemeIcon>
            <br />
            <br />
            <Text component='a' href={link} mt="md" mb={7} c="blue" size="lg">
                {title}
            </Text>
            <Text size="sm" c="dimmed"  lh={1.6}>
                {description}
            </Text>
        </div>
    );
}

export function FeaturesGrid() {
    const features = MOCKDATA.map((feature, index) => (
        <Feature {...feature} key={index} />
    ));

    return (
        <Container className={classes.wrapper}>
            <Title  className={classes.title}>
                User-Friendly UI for Plagiarism Detection
            </Title>

            <Container size={560} p={0}>
                <Text size="md" className={classes.description}>
                    Experience a seamless user interface for leveraging the
                    power of the Measure Of Software Similarity. Receive clear and
                    concise results for efficient analysis and code integrity
                    assurance.
                </Text>
            </Container>

            <SimpleGrid
                mt={60}
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing={{ base: 'xl', md: 50 }}
                verticalSpacing={{ base: 'xl', md: 50 }}
            >
                {features}
            </SimpleGrid>
        </Container>
    );
}
