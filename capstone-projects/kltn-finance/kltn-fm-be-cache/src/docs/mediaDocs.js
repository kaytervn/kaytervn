/**
 * @swagger
 * tags:
 *   name: Media
 *   description: API for uploading and downloading encrypted media files
 */

/**
 * @swagger
 * /v1/media/upload:
 *   post:
 *     summary: Upload a file to the server with encryption
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filePath:
 *                       type: string
 *                       example: "1678912345/example.jpg"
 *       400:
 *         description: No file uploaded or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server configuration error"
 */

/**
 * @swagger
 * /v1/media/download/{folder}/{fileName}:
 *   get:
 *     summary: Download a file from the server with decryption
 *     tags: [Media]
 *     parameters:
 *       - name: folder
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The folder name (timestamp) where the file is stored
 *         example: "1678912345"
 *       - name: fileName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download
 *         example: "example.jpg"
 *     responses:
 *       200:
 *         description: File content with appropriate content type
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "File not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Server configuration error"
 */
