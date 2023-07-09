import {Text, StyleSheet, Button} from "react-native";
import {Table, Row, Rows} from 'react-native-table-component';
import userClient from "../../api_clients/userClient";

export const UserAdministration = ({registeredUsers}) => {
    const {t} = useTranslation('userAdministration')

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
                        user.username,
                        <Button title={t('approveRegistrationButtonTitle')} onPress={async () => await userClient.approveUserRegistration(user.id)}/>,
                        <Button title={t('blockUserButtonTitle')} onPress={async () => await userClient.blockUser(user.id)}/>,
                        <Button title={t('resetPasswordButtonTitle')} onPress={async () => await userClient.resetUserPassword(user.id)}/>
                    ]
                })
            } />
        </Table>
    )
}
