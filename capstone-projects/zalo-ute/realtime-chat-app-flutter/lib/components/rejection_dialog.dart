import 'package:flutter/material.dart';

class RejectionDialog extends StatefulWidget {
  final Function(String reason) onConfirm;
  final String confirmText;
  final VoidCallback onCancel;
  final String? cancelText;
  final String title;
  final String message;
  final Color color;

  const RejectionDialog({
    Key? key,
    required this.onConfirm,
    required this.onCancel,
    required this.confirmText,
    this.cancelText,
    required this.title,
    required this.message,
    this.color = Colors.red,
  }) : super(key: key);

  @override
  State<RejectionDialog> createState() => _RejectionDialogState();
}

class _RejectionDialogState extends State<RejectionDialog> {
  final TextEditingController _reasonController = TextEditingController();
  String? _errorText;

  void _handleConfirm() {
    if (_reasonController.text.isEmpty) {
      setState(() {
        _errorText = "Lý do không được bỏ trống";
      });
    } else {
      _errorText = null;
      widget.onConfirm(_reasonController.text);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 300),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: widget.color,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16.0),
              Text(
                widget.message,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 16.0),
              TextField(
                controller: _reasonController,
                decoration: InputDecoration(
                  labelText: 'Lý do',
                  errorText: _errorText,
                ),
                onChanged: (_) {
                  setState(() {
                    _errorText = null;
                  });
                },
              ),
              const SizedBox(height: 24.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  SizedBox(
                    height: 40,
                    child: ElevatedButton(
                      onPressed: widget.onCancel,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[400],
                      ),
                      child: Text(
                        widget.cancelText ?? "Hủy",
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16.0),
                  SizedBox(
                    height: 40,
                    child: ElevatedButton(
                      onPressed: _handleConfirm,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: widget.color,
                      ),
                      child: Text(
                        widget.confirmText,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
