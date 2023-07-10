import {Text, StyleSheet, Button} from "react-native";
import {Table, Row, Rows} from 'react-native-table-component';
import userClient from "../../api_clients/userClient";

export const UserAdministration = ({registeredUsers}) => {
    const {t} = useTranslation('userAdministration')

    const [alertStyle, setAlertStyle] = useState({});
    const [message, setMessage] = useState("");

    const [getSession] = useSessionStorageJwt()
    const [jwt, setJwt] = useState('')

    const handleApproveRegistration = async (user) => {
        setMessage("")
        try {
            const response = await userClient.approveRegistration(jwt, user.id);;
            if (response.status === "200" || response.status === "201") {
                setAlertStyle(styles.success)
                setMessage(t('successApproveRegistrationMessage'))
                return
            }
            setAlertStyle(styles.error)
            setMessage(response.status)
        } catch (e) {
            setAlertStyle(styles.error)
            setMessage(t('failedApproveRegistrationMessage'))
            console.log('An error occurred while resting password from user:', error);
        }
    }


    async function handleBlockUser(user) {
        setMessage("")
        try {
            const response = await userClient.blockUser(jwt, user.id);
            if (response.status === "200" || response.status === "201") {
                setAlertStyle(styles.success)
                setMessage(t('successBlockUserMessage'))
                return
            }
            setAlertStyle(styles.error)
            setMessage(response.status)
        } catch (e) {
            setAlertStyle(styles.error)
            setMessage(t('failedBlockUserMessage'))
            console.log('An error occurred while blocking user:', error);
        }
    }

    async function handleResetPassword(user) {
        setMessage("")
        try {
            const response = await userClient.resetUserPassword(jwt, user.id);
            if (response.status === "200" || response.status === "201") {
                setAlertStyle(styles.success)
                setMessage(t('successResetPasswordMessage'))
                return
            }
            setAlertStyle(styles.error)
            setMessage(response.status)
        } catch (e) {
            setAlertStyle(styles.error)
            setMessage(t('failedResetRegistrationMessage'))
            console.log('An error occurred while resting password from user:', error);
        }
    }

    useEffect(() => {
        (async function () {
            setJwt((await getSession()).jwt)
        })()
    }, [])

    const styles = StyleSheet.create({
        container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
        head: { height: 40, width: 300, backgroundColor: '#f1f8ff' },
        text: { margin: 6 }
    });
    return (
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Row data={['Username', 'Approve register', 'Block user', 'Reset password']} style={styles.head} />
            <Rows data={
                registeredUsers.map(user => {
                    return [
                        <Text style={styles.text}>{user.username}</Text>,
                        <Pressable style={styles.button}
                                   onPress={async () => await userClient.approveRegistration(jwt, user.id)}>
                            <Text style={styles.text}>{t('approveRegistrationButtonTitle')}</Text>
                        </Pressable>,
                        <Pressable
                            style={styles.button}
                            onPress={async () => await userClient.blockUser(jwt, user.id)}>
                            <Text style={styles.text}>{t('blockUserButtonTitle')}</Text>
                        </Pressable>,
                        <Pressable
                            style={styles.button}
                            onPress={async () => await userClient.resetUserPassword(jwt, user.id)}>
                            <Text style={styles.text}>{t('resetPasswordButtonTitle')}</Text>
                        </Pressable>
                    ]
                })
            }/>
        </Table>
    )
}

const styles = StyleSheet.create({
    container: {margin: width > height ? width * 0.01 : height * 0.01, backgroundColor: '#fff'},
    head: {
        height: width > height ? width * 0.04 : height * 0.04,
        width: valueWidth,
        backgroundColor: '#f1f8ff',
        color: "#fff"
    },
    rows: {height: width > height ? width * 0.03 : height * 0.03, width: valueWidth},
    button:
        {
            height: width > height ? width * 0.03 : height * 0.03,
            backgroundColor: GRAY,
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center"
        },
    text: {
        color: DARKBLUE,
        fontSize: width > height ? width * 0.01 : height * 0.01, textAlign: "center",
    },
    error: {
        fontSize: width > height ? height * 0.02 : width * 0.04,
        color: "red",
        textAlign: "center"
    },
    success: {
        fontSize: width > height ? height * 0.02 : width * 0.04,
        color: "green",
        textAlign: "center"
    }
});