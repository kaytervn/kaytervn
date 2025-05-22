package com.example.bt_tuan11_recyclerview_indicator;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class LinePagerIndicatorDecoration extends RecyclerView.ItemDecoration {
    private final float indicatorHeight;
    private final float indicatorWidth;
    private final float indicatorPadding;
    private final float radius;
    private final int colorActive;
    private final int colorInactive;

    public LinePagerIndicatorDecoration(Context context, float indicatorHeight, float indicatorWidth,
                                        float indicatorPadding, float radius, int colorActive, int colorInactive) {
        this.indicatorHeight = indicatorHeight;
        this.indicatorWidth = indicatorWidth;
        this.indicatorPadding = indicatorPadding;
        this.radius = radius;
        this.colorActive = colorActive;
        this.colorInactive = colorInactive;
    }

    @Override
    public void onDraw(@NonNull Canvas canvas, @NonNull RecyclerView recyclerView, @NonNull RecyclerView.State state) {
        super.onDraw(canvas, recyclerView, state);

        int itemCount = recyclerView.getAdapter().getItemCount();

        // Center horizontally, calculate width and subtract half from center
        float totalWidth = indicatorWidth * itemCount;
        float paddingBetweenItems = Math.max(0, itemCount - 1) * indicatorPadding;
        float indicatorTotalWidth = totalWidth + paddingBetweenItems;
        float indicatorStartX = (recyclerView.getWidth() - indicatorTotalWidth) / 2f;

        // Center vertically in the allotted space
        float indicatorPosY = recyclerView.getHeight() - indicatorHeight / 2f;

        drawInactiveIndicators(canvas, indicatorStartX, indicatorPosY, itemCount);

        // Find active page (which should be highlighted)
        LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
        int activePosition = layoutManager != null ? layoutManager.findFirstVisibleItemPosition() : 0;
        if (activePosition == RecyclerView.NO_POSITION) {
            return;
        }

        // Calculate indicator's horizontal position
        float activeChildStart = layoutManager.findViewByPosition(activePosition).getX();
        float activeChildEnd = activeChildStart + layoutManager.findViewByPosition(activePosition).getWidth();
        float activeIndicatorStartX = indicatorStartX + activeChildStart;
        float activeIndicatorEndX = indicatorStartX + activeChildEnd;

        // Draw the active indicator
        drawActiveIndicator(canvas, activeIndicatorStartX, activeIndicatorEndX, indicatorPosY);
    }

    private void drawInactiveIndicators(Canvas canvas, float startX, float posY, int itemCount) {
        Paint paint = new Paint();
        paint.setColor(colorInactive);
        paint.setStyle(Paint.Style.FILL);
        paint.setAntiAlias(true);

        for (int i = 0; i < itemCount; i++) {
            float cx = startX + i * (indicatorWidth + indicatorPadding);
            canvas.drawRoundRect(new RectF(cx, posY - indicatorHeight / 2f, cx + indicatorWidth,
                    posY + indicatorHeight / 2f), radius, radius, paint);
        }
    }

    private void drawActiveIndicator(Canvas canvas, float startX, float endX, float posY) {
        Paint paint = new Paint();
        paint.setColor(colorActive);
        paint.setStyle(Paint.Style.FILL);
        paint.setAntiAlias(true);

        canvas.drawRoundRect(new RectF(startX, posY - indicatorHeight / 2f, endX,
                posY + indicatorHeight / 2f), radius, radius, paint);
    }
}
