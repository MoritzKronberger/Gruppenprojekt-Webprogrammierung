import { query } from "./index.js";

const getSortings = async () => {
    const result = await query(`SELECT id, name FROM get_language`);
    return { status: 200, result: result.rows };
  },
  getSorting = async (id) => {
    const result = await query(
      `SELECT id, name 
       FROM get_language
       WHERE id = $1::UUID
      `,
      [id]
    );
    return result.rows.length === 0
      ? { status: 404, result: {} }
      : { status: 200, result: result.rows[0] };
  };

export { 
  getSortings, 
  getSorting 
};

export default {
  getSortings,
  getSorting,
};
