/**
 * @swagger
 * tags:
 *   name: Story
 *   description: Story management
 */

/**
 * @swagger
 * /v1/story/create:
 *   post:
 *     summary: Create a new story
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 */

/**
 * @swagger
 * /v1/story/get/{id}:
 *   get:
 *     summary: Get a story by ID
 *     tags: [Story]
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
 * /v1/story/delete/{id}:
 *   delete:
 *     summary: Delete a story
 *     tags: [Story]
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
 * /v1/story/list:
 *   get:
 *     summary: Get list of stories
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: isPaged
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 */
