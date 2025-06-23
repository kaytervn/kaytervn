package com.finance.utils.view_custom;

import android.content.Context;
import android.content.res.TypedArray;
import android.text.Layout;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatTextView;

import com.finance.R;

public class ReadMoreTextView extends AppCompatTextView {
    private int readMoreMaxLine;  // Maximum lines when collapsed
    private String readMoreEndText;    // Text to append at the end, e.g., "Read More"
    private boolean isExpanded = false;  // Tracks whether the text is expanded or not
    private String fullText;  // Holds the full text content

    public ReadMoreTextView(Context context) {
        super(context);
        init(null);
    }

    public ReadMoreTextView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(attrs);
    }

    public ReadMoreTextView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(attrs);
    }

    private void init(AttributeSet attrs) {
        setMovementMethod(LinkMovementMethod.getInstance());  // Enables clickable spans

        if (attrs != null) {
            TypedArray a = getContext().obtainStyledAttributes(attrs, R.styleable.ReadMoreTextView);
            readMoreMaxLine = a.getInteger(R.styleable.ReadMoreTextView_readMoreMaxLine, 10);
            readMoreEndText = a.getString(R.styleable.ReadMoreTextView_readMoreEndText);
            a.recycle();
        }

        setEllipsize(TextUtils.TruncateAt.END);  // Adds ellipsis when text is truncated
        setMaxLines(readMoreMaxLine);  // Set max lines to collapsed value
        isExpanded = false;
    }

    @Override
    public void setText(CharSequence text, BufferType type) {
        super.setText(text, type);
        fullText = text.toString();  // Store the full text when setting it
        updateText();  // Adds "Read More" functionality when text is set
    }

    private void updateText() {
        post(() -> {
            Layout layout = getLayout();
            if (layout != null && layout.getLineCount() > readMoreMaxLine) {
                int end = layout.getLineEnd(readMoreMaxLine - 1);
                SpannableString spannableString = getSpannableString(end);

                super.setText(spannableString, BufferType.SPANNABLE);
                setMovementMethod(LinkMovementMethod.getInstance());
            } else {
                super.setText(fullText, BufferType.NORMAL);
            }
        });
    }

    @NonNull
    private SpannableString getSpannableString(int end) {
        String truncatedText = fullText.substring(0, end) + "... " + readMoreEndText;

        SpannableString spannableString = new SpannableString(truncatedText);
        ClickableSpan clickableSpan = new ClickableSpan() {
            @Override
            public void onClick(@NonNull View widget) {
                toggleText();
            }
        };

        spannableString.setSpan(clickableSpan, truncatedText.length() - readMoreEndText.length(),
                truncatedText.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        return spannableString;
    }

    private void toggleText() {
        isExpanded = !isExpanded;  // Toggles the expanded state
        if (isExpanded) {
            setMaxLines(Integer.MAX_VALUE);
            super.setText(fullText);
        } else {
            setMaxLines(readMoreMaxLine);
            updateText();
        }
    }
}
