/* template from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_postgres_01 */

import { query } from "./index.js";

const getAccountsAll = async () => {
    return [
      200,
      (
        await query(`SELECT id, username, profile_picture 
                     FROM   v_account
          `)
      ).rows,
    ];
  },

  getAccountSearch = async (key) => {
    const result = await query(
      `SELECT id, username, profile_picture
       FROM   v_account
       WHERE  username = $1::VARCHAR
      `,
      [key]
    );
    return result.rows.length === 0 ? [404, {}] : [200, result.rows];
  },

  getAccounts = async (key) => {
    return key ? getAccountSearch(key) : getAccountsAll();
  },

  getAccount = async (id) => {
    const result = await query(
      `SELECT id, username, profile_picture
       FROM   v_account
       WHERE  $1::UUID = id
      `,
      [id]
    );
    return result.rows.length === 0 ? [404, {}] : [200, result.rows[0]];
  },

  //TODO: check profile picture for accepted content
  postAccount = async (data) => {
    const result = await query(
      `SELECT status, result FROM post_account($1)`,
      [data]
    );
    return result.rows[0]
  },

  //TODO: check profile_picture for accepted content
  putAccount = async (id, data) => {
    const result = await query(
      `SELECT status, result FROM put_account($1, $2)`,
      [id, data]
    );
    return result.rows[0]
  },

  patchAccount = async (id, data) => {
    const result = await query(
      `SELECT status, result FROM patch_account($1, $2)`,
      [id, data]
    );
    return result.rows[0]
  },
  
  deleteAccount = async (id) => {
    const result = await query(
      `SELECT status, result FROM delete_account($1)`,
      [id]
    );
    return result.rows[0]
  };

export {
  getAccounts,
  postAccount,
  getAccount,
  putAccount,
  patchAccount,
  deleteAccount,
};

export default {
  getAccounts,
  postAccount,
  getAccount,
  putAccount,
  patchAccount,
  deleteAccount,
};