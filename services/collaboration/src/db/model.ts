import { Attempt } from '@common/shared-types';
import { DocumentSnapshot, FieldPath, Query, QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { db } from './clients';

/* [Main] */

async function queryToAttempts(query: Query): Promise<Attempt[]> {
  let querySnapshot: QuerySnapshot = await query.get();
  let docSnapshots: QueryDocumentSnapshot[] = querySnapshot.docs;

  return docSnapshots.map(docSnapshotToAttempt);
}

function docSnapshotToAttempt(docSnapshot: DocumentSnapshot): Attempt {
  let doc: any = docSnapshot.data();

	return {
    questionId: doc.questionId,
    createdAt: doc.createdAt,
    code: doc.code,
  };
}

/* [Exports] */

async function getAttempts(userId: string): Promise<Attempt[]> {
  let query: Query = db;
	query = query.where(
		new FieldPath('userMatchDoneData', 'userIds'),
		'array-contains',
		userId
	);

  return queryToAttempts(query);
}

let model = {
  getAttempts
};
export default model;
