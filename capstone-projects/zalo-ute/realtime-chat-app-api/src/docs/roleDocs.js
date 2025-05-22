/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management
 */

/**
 * @swagger
 * /v1/role/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of permission IDs
 *               kind:
 *                 type: number
 *                 enum: [1, 2, 3]
 */

/**
 * @swagger
 * /v1/role/update:
 *   put:
 *     summary: Update an existing role
 *     tags: [Role]
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
 *                 description: ID of the role to update
 *               name:
 *                 type: string
 *                 description: New name for the role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated array of permission IDs
 *               kind:
 *                 type: number
 *                 enum: [1, 2, 3]
 */

/**
 * @swagger
 * /v1/role/get/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the role to retrieve
 */

/**
 * @swagger
 * /v1/role/list:
 *   get:
 *     summary: Get list of roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter roles by name (case-insensitive regex)
 *       - in: query
 *         name: kind
 *         schema:
 *           type: number
 *         description: Filter roles by kind
 *       - in: query
 *         name: isPaged
 *         schema:
 *           type: string
 *         description: Set to "0" for unpaged results
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *         description: Number of items per page
 */
