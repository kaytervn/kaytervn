FROM dart:stable AS build

RUN git clone https://github.com/flutter/flutter.git /flutter \
  && /flutter/bin/flutter doctor

ENV PATH="/flutter/bin:/flutter/bin/cache/dart-sdk/bin:${PATH}"

RUN flutter config --enable-web

WORKDIR /app
COPY pubspec.* ./
RUN flutter pub get

COPY . .
RUN flutter build web --release

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build/web /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
