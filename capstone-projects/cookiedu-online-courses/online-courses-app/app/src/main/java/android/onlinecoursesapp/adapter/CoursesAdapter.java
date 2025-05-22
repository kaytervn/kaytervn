package android.onlinecoursesapp.adapter;

import android.content.Context;
import android.onlinecoursesapp.R;
import android.onlinecoursesapp.model.Course;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

public class CoursesAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    final int VIEW_TYPE_ITEM = 0;
    final int VIEW_TYPE_LOADING = 1;
    Context context;
    List<Course> courses;
    OnItemClickListener listener;

    public interface OnItemClickListener {
        void onViewIntroClick(Course course);

        void onAddToCartClick(Course course);
    }

    public void setData(List<Course> courses) {
        this.courses = courses;
        notifyDataSetChanged();
    }

    public CoursesAdapter(Context context, OnItemClickListener listener) {
        this.context = context;
        this.listener = listener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == VIEW_TYPE_ITEM) {
            View view = LayoutInflater.from(context).inflate(R.layout.course_item_view, parent, false);
            return new CourseItemViewHolder(view);
        } else {
            View view = LayoutInflater.from(context).inflate(R.layout.course_loading_view, parent, false);
            return new CourseLoadingViewHolder(view);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof CourseItemViewHolder) {
            holder.setIsRecyclable(false);
            ((CourseItemViewHolder) holder).bind(courses.get(position), listener);
            ((CourseItemViewHolder) holder).textTitle.setText(courses.get(position).getTitle());
            Glide.with(context)
                    .load(courses.get(position).getPicture())
                    .into(((CourseItemViewHolder) holder).imagePicture);
            ((CourseItemViewHolder) holder).textTopic.setText(courses.get(position).getTopic());
            ((CourseItemViewHolder) holder).textInstructorName.setText(courses.get(position).getInstructorName());
            ((CourseItemViewHolder) holder).textCreatedDate.setText(courses.get(position).getCreatedAt());
            ((CourseItemViewHolder) holder).textPrice.setText(String.valueOf(courses.get(position).getPrice()));
        }
    }

    @Override
    public int getItemViewType(int position) {
        return this.courses.get(position) == null ? VIEW_TYPE_LOADING : VIEW_TYPE_ITEM;
    }

    @Override
    public int getItemCount() {
        return this.courses == null ? 0 : courses.size();
    }

    public class CourseItemViewHolder extends RecyclerView.ViewHolder {
        ImageView imagePicture;
        TextView textTitle, textTopic, textPrice, textCreatedDate, textInstructorName;
        Button buttonViewIntro;
        Button buttonAddToCart;

        public CourseItemViewHolder(@NonNull View itemView) {
            super(itemView);
            imagePicture = itemView.findViewById(R.id.imagePicture);
            textTitle = itemView.findViewById(R.id.textTitle);
            textTopic = itemView.findViewById(R.id.textTopic);
            textPrice = itemView.findViewById(R.id.textPrice);
            textCreatedDate = itemView.findViewById(R.id.textCreatedDate);
            buttonViewIntro = itemView.findViewById(R.id.buttonViewIntro);
            buttonAddToCart = itemView.findViewById(R.id.buttonAddToCart);
            textInstructorName = itemView.findViewById(R.id.textInstructorName);
        }

        public void bind(Course course, final OnItemClickListener listener) {
            buttonViewIntro.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onViewIntroClick(course);
                }
            });

            buttonAddToCart.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    listener.onAddToCartClick(course);
                }
            });
        }
    }

    public class CourseLoadingViewHolder extends RecyclerView.ViewHolder {

        ProgressBar progressBar;

        public CourseLoadingViewHolder(@NonNull View itemView) {
            super(itemView);
            progressBar = itemView.findViewById(R.id.progressBar);
        }
    }
}
