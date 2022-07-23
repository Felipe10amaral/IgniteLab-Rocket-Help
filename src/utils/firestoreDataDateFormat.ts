import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export function dateFormat( timestamp: FirebaseFirestoreTypes.Timestamp) {
    if(timestamp) {
        const date = new Date(timestamp.toDate());

        const day = date.toLocaleDateString('pt-br');
        const hour = date.toLocaleTimeString('pt-br');

        return `${day} às ${hour}`;
    }
}