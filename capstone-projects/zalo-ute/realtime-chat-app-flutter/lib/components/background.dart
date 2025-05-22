import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class GradientBackground extends StatefulWidget {
  final List<Widget> children;
  final String? title;
  final bool showBackButton;
  final Color? primaryColor;
  final Color? secondaryColor;
  final bool centerTitle;
  final double horizontalPadding;
  final Widget? leadingIcon;
  final Future<bool> Function()? onWillPop;
  final VoidCallback? onBackPressed;

  const GradientBackground({
    Key? key,
    required this.children,
    this.title,
    this.showBackButton = true,
    this.primaryColor,
    this.secondaryColor,
    this.centerTitle = true,
    this.horizontalPadding = 24.0,
    this.leadingIcon,
    this.onWillPop,
    this.onBackPressed,
  }) : super(key: key);

  @override
  _GradientBackgroundState createState() => _GradientBackgroundState();
}

class _GradientBackgroundState extends State<GradientBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeIn,
      ),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<bool> _handleWillPop() async {
    if (widget.onWillPop != null) {
      return await widget.onWillPop!();
    }
    return true;
  }

  void _handleBackPress() {
    if (widget.onBackPressed != null) {
      widget.onBackPressed!();
    } else {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget body = Scaffold(
      extendBodyBehindAppBar: true,
      appBar: (widget.title != null || widget.showBackButton)
          ? AppBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              centerTitle: widget.centerTitle,
              leading: widget.showBackButton
                  ? widget.leadingIcon ??
                      IconButton(
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.arrow_back_ios_new,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        onPressed: _handleBackPress,
                      )
                  : null,
              title: widget.title != null
                  ? Text(
                      widget.title!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    )
                  : null,
              systemOverlayStyle: SystemUiOverlayStyle.light,
            )
          : null,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              widget.primaryColor ?? const Color(0xFF1565C0),
              widget.secondaryColor ?? const Color(0xFF1E88E5),
            ],
            stops: const [0.0, 1.0],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: Container(
              height: double.infinity,
              padding: EdgeInsets.symmetric(
                horizontal: widget.horizontalPadding,
              ),
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (widget.title == null && !widget.showBackButton)
                      const SizedBox(height: 24),
                    ...widget.children,
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
    if (widget.onWillPop != null) {
      body = WillPopScope(
        onWillPop: _handleWillPop,
        child: body,
      );
    }
    return body;
  }
}
