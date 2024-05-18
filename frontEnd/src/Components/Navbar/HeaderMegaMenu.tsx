import {
    HoverCard,
    Group,
    Button,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Anchor,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    rem,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconReportAnalytics, IconUpload } from '@tabler/icons-react';
import classes from './HeaderMegaMenu.module.css';
import { RemoveUser, selectIsAuth } from '../../Redux/UserContext/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { FEATURES } from './Utils';

export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const query = useQueryClient();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const theme = useMantineTheme();

    const links = FEATURES.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title}>
            <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon
                        style={{ width: rem(22), height: rem(22) }}
                        color={theme.colors.blue[6]}
                    />
                </ThemeIcon>
                <div>
                    <Text size="sm" fw={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    const handleLogout = async () => {
        // setSearchParams("logout=true", { replace: true })
        // const httpService = new Service()
        // httpService.post(LOGOUT_ROUTE, { token: token }).catch(err => console.error(err))
        localStorage.clear();
        query.clear();
        sessionStorage.clear();
        dispatch(RemoveUser());
        showNotification({
            title: 'Logged out!',
            message: `You've been successfully logged out of Mentorpick.`,
            color: 'teal',
            autoClose: false,
        });
        navigate('/login');
    };

    return (
        <Box pb={1}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Text component='a' href="#" size="xl" fw={800}>
                        {' '}
                        PlagiarismCheck
                    </Text>

                    {isAuth && (
                        <Group h="100%" gap={0} visibleFrom="sm">
                            <a href="/upload/doc" className={classes.link}>
                                Upload-Run
                                <IconUpload />
                            </a>
                            <a href="/my/report" className={classes.link}>
                                My Report
                                <IconReportAnalytics/>
                            </a>
                            <HoverCard
                                width={600}
                                position="bottom"
                                radius="md"
                                shadow="md"
                                withinPortal
                            >
                                <HoverCard.Target>
                                    <a href="#" className={classes.link}>
                                        <Center inline>
                                            <Box component="span" mr={5}>
                                                Features
                                            </Box>
                                            <IconChevronDown
                                                style={{
                                                    width: rem(16),
                                                    height: rem(16),
                                                }}
                                                color={theme.colors.blue[6]}
                                            />
                                        </Center>
                                    </a>
                                </HoverCard.Target>

                                <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                                    <Group justify="space-between" px="md">
                                        <Text fw={500}>Features</Text>
                                        <Anchor href="#" fz="xs">
                                            View all
                                        </Anchor>
                                    </Group>

                                    <Divider my="sm" />

                                    <SimpleGrid cols={2} spacing={0}>
                                        {links}
                                    </SimpleGrid>

                                    <div className={classes.dropdownFooter}>
                                        <Group justify="space-between">
                                            <div>
                                                <Text fw={500} fz="sm">
                                                    Get started
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    Their food sources have decreased, and their
                                                    numbers
                                                </Text>
                                            </div>
                                            <Button variant="default">Get started</Button>
                                        </Group>
                                    </div>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </Group>
                    )}

                    <Group visibleFrom="sm">
                        {!isAuth ? (
                            <Button component="a" href="/login" variant="transparent">
                                Log in
                            </Button>
                        ) : (
                            <Button c={'blue'} variant="transparent" onClick={handleLogout}>
                                Log out
                            </Button>
                        )}
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm" />

                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <a href="/upload/doc" className={classes.link}>
                        Upload-Run
                    </a>
                    <a href="/my/report" className={classes.link}>
                        My Report
                    </a>
                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Features
                            </Box>
                            <IconChevronDown
                                style={{ width: rem(16), height: rem(16) }}
                                color={theme.colors.blue[6]}
                            />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={linksOpened}>{links}</Collapse>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        {!isAuth ? (
                            <Button component="a" href="/login" variant="transparent">
                                Log in
                            </Button>
                        ) : (
                            <Button c={'blue'} variant="transparent" onClick={handleLogout}>
                                Log out
                            </Button>
                        )}
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
