package android.onlinecoursesapp.adapter;
import android.content.Context;

import android.content.Intent;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.activity.LessonDetailActivity;
import android.onlinecoursesapp.model.Lesson;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class LessonAdapter extends RecyclerView.Adapter<LessonAdapter.LessonViewHolder> {

    private Context context;
    private List<Lesson> lessonList;

    public LessonAdapter(Context context, List<Lesson> lessonList) {
        this.context = context;
        this.lessonList = lessonList;
    }

    @NonNull
    @Override
    public LessonViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_lesson, parent, false);
        return new LessonViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull LessonViewHolder holder, int position) {
        Lesson lesson = lessonList.get(position);
        holder.tvLessonTitle.setText(lesson.getTitle());
        holder.tvLessonDescription.setText(lesson.getDescription());

        holder.btnViewLesson.setOnClickListener(v -> {
            Intent intent = new Intent(context, LessonDetailActivity.class);
            intent.putExtra("lesson_id", lesson.get_id());
            intent.putExtra("course_id", lesson.getCourseId());
            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return lessonList.size();
    }

    public static class LessonViewHolder extends RecyclerView.ViewHolder {

        TextView tvLessonTitle, tvLessonDescription;
        Button btnViewLesson;

        public LessonViewHolder(@NonNull View itemView) {
            super(itemView);
            tvLessonTitle = itemView.findViewById(R.id.tvLessonTitle);
            tvLessonDescription = itemView.findViewById(R.id.tvLessonDescription);
            btnViewLesson = itemView.findViewById(R.id.btnViewLessonDetail);
        }
    }
}
