package android.onlinecoursesapp.adapter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.activity.CourseDetailActivity;
import android.onlinecoursesapp.activity.CourseIntroActivity;
import android.onlinecoursesapp.activity.ReviewCourseActivity;
import android.onlinecoursesapp.model.Course;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

public class MyCourseAdapter extends RecyclerView.Adapter<MyCourseAdapter.MyViewHolder> {
    Context context;
    List<Course> array;
    String token;

    public MyCourseAdapter(Context context, List<Course> array, String token) {
        this.context = context;
        this.array = array;
        this.token = token;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_my_course, null);
        MyViewHolder myViewHolder = new MyViewHolder(view);
        return myViewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull MyViewHolder holder, int position) {
        Course course = array.get(position);
        holder.Name.setText(course.getTitle());
        holder.Description.setText(course.getDescription());
        holder.IntrucName.setText(course.getInstructorName());
        Glide.with(context).load(course.getPicture())
                .into(holder.imagePic);
        holder.course = course;
    }

    @Override
    public int getItemCount() {
        return array == null ? 0 : array.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder{

        public ImageView imagePic;
        public TextView Name;
        public TextView Description;
        public TextView IntrucName;
        public Button btn_review;
        public Course course;
        public MyViewHolder(@NonNull View itemView){
            super(itemView);
            imagePic = (ImageView) itemView.findViewById(R.id.imagePic);
            Name = (TextView) itemView.findViewById(R.id.textName);
            Description = (TextView) itemView.findViewById(R.id.textDesc);
            IntrucName = (TextView) itemView.findViewById(R.id.textIntrucName);
            btn_review = (Button) itemView.findViewById(R.id.btn_review);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // chuyển sang chi tiết khóa học
                    Intent intent = new Intent(context, CourseIntroActivity.class);
                    intent.putExtra("course_id", course.getId());
                    context.startActivity(intent);
                    //Toast.makeText(context, "Bạn đã chọn ____", Toast.LENGTH_SHORT).show();
                }
            });
            btn_review.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (context instanceof Activity) {
                        ((Activity) context).finish();
                    }
                    Intent intent = new Intent(context, ReviewCourseActivity.class);
                    intent.putExtra("token", token);
                    intent.putExtra("course", course);
                    context.startActivity(intent);
                }
            });
        }

    }
}
