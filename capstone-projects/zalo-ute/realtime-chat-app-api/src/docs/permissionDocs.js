/**
 * @swagger
 * tags:
 *   name: Permission
 *   description: Permission management
 */

/**
 * @swagger
 * /v1/permission/create:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permission]
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
 *               permissionCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /v1/permission/list:
 *   get:
 *     summary: Get list of all permissions
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           permissionCode:
 *                             type: string
 */
