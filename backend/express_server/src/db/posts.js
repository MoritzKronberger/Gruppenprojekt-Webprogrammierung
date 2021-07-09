import { query } from "./index.js";

// TODO: limit für returned rows?
const getPostsAll = async () => {
    const result = await query(
      `SELECT "id", "creation_time", "title", "content", "language", "user_id", "username", "num_likes", "num_comments", "categories"
       FROM get_full_post
      `);
    return { status: 200, result: result.rows };
  },
  // TODO: weniger hacky implementieren?
  getPostSorted = async (key, query_string) => {
    console.log("in methode", key, query_string);
    const view = await query(
      `SELECT "view_name"
       FROM get_sort_by_view_name
       WHERE "id" = $1::UUID
       `, 
      [key]
    );
    if(view.rows.length===0){
      return { status: 404, result: {} }
    }
    let result = null;
    if(query_string){
      console.log("get quer", query_string);
      result = await query(
        `SELECT DISTINCT "sort_rank", p."id", "creation_time", "title", "content", "language", "user_id", "username", "num_likes", "num_comments", "categories"
         FROM ${view.rows[0].view_name} p
              JOIN has_category hc ON p."id" = hc."post_id"
              JOIN e_category ct   ON hc."category_id" = ct."id"
         WHERE "trigram_category" ILIKE '%' || $1::VARCHAR || '%' OR $1::VARCHAR <<% "trigram_category"
        `, 
        [query_string]
      );
    } else {
      result = await query(
        `SELECT "sort_rank", "id", "creation_time", "title", "content", "language", "user_id", "username", "num_likes", "num_comments", "categories"
         FROM ${view.rows[0].view_name}
        `
      );
    }

    return result.rows.length === 0
      ? { status: 404, result: {} }
      : { status: 200, result: result.rows };
  },
  getPosts = async (key, query_string) => {
    console.log(key, query_string);
    return key ? getPostSorted(key, query_string) : getPostsAll();
  },
  getPost = async (id) => {
    const result = await query(
      `SELECT "id", "user_id"
       FROM get_post
       WHERE "id" = $1::UUID
      `, 
      [id]
    );
    return result.rows.length === 0
      ? { status: 404, result: {} }
      : { status: 200, result: result.rows[0] };
  },
  getPostsWithCategories = async (id) => {
    const result = await query(
      `SELECT "id" AS "category_id", "name", "post_id"
       FROM get_category_join_post
       WHERE "post_id" = $1::UUID
      `, 
      [id]
    );
    return result.rows.length === 0
      ? { status: 404, result: {} }
      : { status: 200, result: result.rows };
  },
  postPost = async (data) => {
    const result = await query(
      `SELECT "result" FROM post_post($1)`, 
      [data]
    );
    return result.rows[0];
  },
  patchPost = async (id, data) => {
    const result = await query(
      `SELECT "result" FROM patch_post($1, $2)`, 
      [id, data]
    );
    return result.rows[0];
  },
  deletePost = async (id) => {
    const result = await query(`SELECT "result" FROM delete_post($1)`, 
    [id]
  );
    return result.rows[0];
  };

export { 
  getPosts, 
  getPost, 
  getPostsWithCategories,
  postPost, 
  patchPost, 
  deletePost 
};

export default { 
  getPosts, 
  getPost,
  getPostsWithCategories,
  postPost, 
  patchPost, 
  deletePost 
};
