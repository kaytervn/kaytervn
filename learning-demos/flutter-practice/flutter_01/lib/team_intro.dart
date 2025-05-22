import 'package:flutter/material.dart';

class TeamMember {
  final String studentId;
  final String fullName;
  final String github;
  final String avatarUrl;

  TeamMember({
    required this.studentId,
    required this.fullName,
    required this.github,
    required this.avatarUrl,
  });
}

class TeamIntroScreen extends StatefulWidget {
  @override
  State<TeamIntroScreen> createState() => _TeamIntroScreenState();
}

class _TeamIntroScreenState extends State<TeamIntroScreen> {
  final List<TeamMember> teamMembers = [
    TeamMember(
      studentId: '21110332',
      fullName: 'Kiến Đức Trọng',
      github: 'kaytervn',
      avatarUrl: 'https://ui-avatars.com/api/?name=Kiến+Đức+Trọng',
    ),
    TeamMember(
      studentId: '21110335',
      fullName: 'Nguyễn Trần Văn Trung',
      github: 'vantrung1109',
      avatarUrl: 'https://ui-avatars.com/api/?name=Nguyễn+Trần+Văn+Trung',
    ),
    TeamMember(
      studentId: '21110157',
      fullName: 'Lê Trọng Dũng',
      github: 'trongdung721',
      avatarUrl: 'https://ui-avatars.com/api/?name=Lê+Trọng+Dũng',
    ),
    TeamMember(
      studentId: '21110294',
      fullName: 'Võ Hữu Tài',
      github: 'vohuutai23',
      avatarUrl: 'https://ui-avatars.com/api/?name=Võ+Hữu+Tài',
    ),
  ];

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(seconds: 10), () {
      Navigator.pushNamed(context, '/login');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Giới thiệu thành viên nhóm'),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: teamMembers.length,
              itemBuilder: (context, index) {
                final member = teamMembers[index];
                return Card(
                  margin: EdgeInsets.all(8.0),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(member.avatarUrl ??
                          'https://ui-avatars.com/api/?name=No+Avatar'),
                    ),
                    title: Text(member.fullName),
                    subtitle: Text('MSSV: ${member.studentId}'),
                    trailing: Text('GitHub: ${member.github}'),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              child: Text('Đến trang đăng nhập'),
              onPressed: () {
                Navigator.pushNamed(context, '/login');
              },
            ),
          ),
        ],
      ),
    );
  }
}
