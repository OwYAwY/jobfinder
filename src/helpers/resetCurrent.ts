import { client } from '~/instances';
import { print } from './print.js';

export const resetCurrent = async(id: number) => {
  return await client.user.update({
    where: {
      id
    },
    data: {
      currentUser: -1
    }
  })  
    .catch(e => {
      print('resetCurrent', e);
      return false;
    })
    .then(() => true);
};
