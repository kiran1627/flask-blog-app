from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'blog_management_secret_key'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database initialization
def init_db():
    conn = sqlite3.connect('blog.db')
    c = conn.cursor()
    
    # Create users table
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0
    )
    ''')
    
    # Create blogs table
    c.execute('''
    CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        tags TEXT,
        domain TEXT NOT NULL,
        content TEXT NOT NULL,
        image_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Check if admin exists, if not create one
    c.execute("SELECT * FROM users WHERE username = 'admin'")
    if not c.fetchone():
        admin_password = generate_password_hash('admin123')
        c.execute("INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)",
                 ('admin', admin_password, 1))
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = sqlite3.connect('blog.db')
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[2], password):
            session['logged_in'] = True
            session['username'] = username
            session['is_admin'] = user[3]
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('register.html')
        
        hashed_password = generate_password_hash(password)
        
        conn = sqlite3.connect('blog.db')
        c = conn.cursor()
        
        try:
            c.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                     (username, hashed_password))
            conn.commit()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Username already exists', 'error')
        finally:
            conn.close()
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/write', methods=['GET', 'POST'])
def write_blog():
    if 'logged_in' not in session:
        flash('Please login to write a blog', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        title = request.form['title']
        author = session['username']
        tags = request.form['tags']
        domain = request.form['domain']
        content = request.form['content']
        
        # Handle file upload
        image_path = None
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                unique_filename = f"{timestamp}_{filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                image_path = f"uploads/{unique_filename}"
        
        conn = sqlite3.connect('blog.db')
        c = conn.cursor()
        c.execute("INSERT INTO blogs (title, author, tags, domain, content, image_path) VALUES (?, ?, ?, ?, ?, ?)",
                 (title, author, tags, domain, content, image_path))
        conn.commit()
        conn.close()
        
        flash('Blog published successfully!', 'success')
        return redirect(url_for('view_blogs'))
    
    return render_template('write.html')

@app.route('/blogs')
def view_blogs():
    domain_filter = request.args.get('domain', 'All')
    search_query = request.args.get('search', '')
    
    conn = sqlite3.connect('blog.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    query = "SELECT * FROM blogs"
    params = []
    
    conditions = []
    if domain_filter != 'All':
        conditions.append("domain = ?")
        params.append(domain_filter)
    
    if search_query:
        conditions.append("(title LIKE ? OR content LIKE ? OR tags LIKE ?)")
        search_term = f"%{search_query}%"
        params.extend([search_term, search_term, search_term])
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    query += " ORDER BY created_at DESC"
    
    c.execute(query, params)
    blogs = c.fetchall()
    
    # Get unique domains for filter dropdown
    c.execute("SELECT DISTINCT domain FROM blogs")
    domains = [row[0] for row in c.fetchall()]
    
    conn.close()
    
    return render_template('blogs.html', blogs=blogs, domains=domains, 
                           current_domain=domain_filter, search_query=search_query)

@app.route('/blog/<int:blog_id>')
def view_blog(blog_id):
    conn = sqlite3.connect('blog.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM blogs WHERE id = ?", (blog_id,))
    blog = c.fetchone()
    conn.close()
    
    if blog:
        return render_template('blog_detail.html', blog=blog)
    else:
        flash('Blog not found', 'error')
        return redirect(url_for('view_blogs'))

@app.route('/admin')
def admin_dashboard():
    if 'logged_in' not in session or not session.get('is_admin'):
        flash('Admin access required', 'error')
        return redirect(url_for('index'))
    
    conn = sqlite3.connect('blog.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT * FROM users")
    users = c.fetchall()
    
    c.execute("SELECT * FROM blogs ORDER BY created_at DESC")
    blogs = c.fetchall()
    
    conn.close()
    
    return render_template('admin.html', users=users, blogs=blogs)

@app.route('/admin/delete_blog/<int:blog_id>', methods=['POST'])
def delete_blog(blog_id):
    if 'logged_in' not in session or not session.get('is_admin'):
        flash('Admin access required', 'error')
        return redirect(url_for('index'))
    
    conn = sqlite3.connect('blog.db')
    c = conn.cursor()
    
    # Get the image path before deletion
    c.execute("SELECT image_path FROM blogs WHERE id = ?", (blog_id,))
    result = c.fetchone()
    
    if result and result[0]:
        image_path = os.path.join('static', result[0])
        if os.path.exists(image_path):
            os.remove(image_path)
    
    c.execute("DELETE FROM blogs WHERE id = ?", (blog_id,))
    conn.commit()
    conn.close()
    
    flash('Blog deleted successfully', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete_user/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    if 'logged_in' not in session or not session.get('is_admin'):
        flash('Admin access required', 'error')
        return redirect(url_for('index'))
    
    conn = sqlite3.connect('blog.db')
    c = conn.cursor()
    
    # Prevent deleting the admin user
    c.execute("SELECT is_admin FROM users WHERE id = ?", (user_id,))
    user = c.fetchone()
    
    if user and user[0] == 1:
        flash('Cannot delete admin user', 'error')
    else:
        c.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        flash('User deleted successfully', 'success')
    
    conn.close()
    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=10000)

