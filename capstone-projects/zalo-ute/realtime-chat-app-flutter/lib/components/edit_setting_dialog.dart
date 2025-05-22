import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cms_chat_app/core/constants.dart';
import 'package:cms_chat_app/models/setting.dart';

class EditSettingDialog extends StatefulWidget {
  final Setting setting;
  final Function(String id, int value) onUpdate;

  const EditSettingDialog({
    Key? key,
    required this.setting,
    required this.onUpdate,
  }) : super(key: key);

  @override
  State<EditSettingDialog> createState() => _EditSettingDialogState();
}

class _EditSettingDialogState extends State<EditSettingDialog> {
  late TextEditingController _controller;
  late bool _isVerifyPost;
  late int _currentValue;

  @override
  void initState() {
    super.initState();
    _isVerifyPost = widget.setting.keyName == Constants.VERIFY_FRIEND_POSTS ||
        widget.setting.keyName == Constants.VERIFY_PUBLIC_POSTS;
    _currentValue = widget.setting.value;
    _controller = TextEditingController(text: widget.setting.value.toString());
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  bool _validateInput(String value) {
    if (value.isEmpty) return false;
    try {
      int number = int.parse(value);
      return number >= 0;
    } catch (e) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16.0),
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: 400),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.setting.title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    color: Colors.blue[600], fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16.0),
              if (_isVerifyPost)
                SwitchListTile(
                  activeColor: Colors.blue[600],
                  title: Text("Bật/Tắt"),
                  value: _currentValue == 1,
                  onChanged: (bool value) {
                    setState(() {
                      _currentValue = value ? 1 : 0;
                    });
                  },
                )
              else
                TextField(
                  controller: _controller,
                  keyboardType: TextInputType.number,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                  ],
                  decoration: InputDecoration(
                    labelText: "Giá trị",
                    errorText: !_validateInput(_controller.text)
                        ? "Vui lòng nhập số nguyên >= 0"
                        : null,
                  ),
                ),
              const SizedBox(height: 24.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  SizedBox(
                    height: 40,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[400],
                      ),
                      child: Text(
                        "Hủy",
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16.0),
                  SizedBox(
                    height: 40,
                    child: ElevatedButton(
                      onPressed: () {
                        if (_isVerifyPost) {
                          widget.onUpdate(widget.setting.id, _currentValue);
                        } else if (_validateInput(_controller.text)) {
                          widget.onUpdate(
                              widget.setting.id, int.parse(_controller.text));
                        }
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                      ),
                      child: Text(
                        "Lưu",
                        style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white),
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
