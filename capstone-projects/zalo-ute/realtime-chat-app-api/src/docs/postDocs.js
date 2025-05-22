/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post management
 */

/**
 * @swagger
 * /v1/post/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: number
 *                 enum: [1, 2, 3]
 *               kind:
 *                 type: number
 *                 enum: [1, 2, 3]
 */

/**
 * @swagger
 * /v1/post/update:
 *   put:
 *     summary: Update an existing post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *               kind:
 *                 type: number
 *                 enum: [1, 2, 3]
 */

/**
 * @swagger
 * /v1/post/get/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

/**
 * @swagger
 * /v1/post/delete/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 */

/**
 * @swagger
 * /v1/post/list:
 *   get:
 *     summary: Get list of posts
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: number
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: kind
 *         schema:
 *           type: number
 *       - in: query
 *         name: isPaged
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: getListKind
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 */

/**
 * @swagger
 * /v1/post/change-state:
 *   put:
 *     summary: Change post status
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *                 enum: [1, 2, 3]
 *               reason:
 *                 type: string
 */
