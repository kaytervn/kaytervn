package com.finance.utils.view_custom;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

public class DiagonalLineView extends View {

    private Paint paint;

    public DiagonalLineView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        // Thiết lập Paint cho đường gạch chéo
        paint = new Paint();
        paint.setColor(Color.RED); // Màu đường chéo (tùy chỉnh theo nhu cầu)
        paint.setStrokeWidth(5f);    // Độ dày của đường
        paint.setStyle(Paint.Style.STROKE);
        paint.setAntiAlias(true);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // Vẽ đường gạch chéo từ góc trên trái xuống góc dưới phải
        canvas.drawLine(0, 0, getWidth(), getHeight(), paint);
    }
}