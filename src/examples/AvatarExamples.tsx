import { Avatar } from '../components';

const AvatarExamples = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Avatar Component Examples</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>1. Valid Image URL</h2>
        <p>Shows the actual user image when available:</p>
        <Avatar
          src="https://i.pravatar.cc/150?img=1"
          name="John Doe"
          size={48}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>2. Broken/Invalid Image URL (Fallback Triggered)</h2>
        <p>Automatically falls back to generated avatar:</p>
        <Avatar
          src="https://broken-url-that-doesnt-exist.com/image.jpg"
          name="Jane Smith"
          size={48}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>3. Empty String (Fallback)</h2>
        <p>Uses fallback when src is empty:</p>
        <Avatar
          src=""
          name="Alice Johnson"
          size={48}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>4. Undefined/Null (Fallback)</h2>
        <p>Uses fallback when src is undefined or null:</p>
        <Avatar
          src={undefined}
          name="Bob Wilson"
          size={48}
        />
        <span style={{ marginLeft: '20px' }}></span>
        <Avatar
          src={null}
          name="Carol Davis"
          size={48}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>5. Different Sizes</h2>
        <p>Avatar scales to any size:</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Avatar src={undefined} name="Small User" size={24} />
          <Avatar src={undefined} name="Medium User" size={40} />
          <Avatar src={undefined} name="Default User" size={48} />
          <Avatar src={undefined} name="Large User" size={64} />
          <Avatar src={undefined} name="Extra Large User" size={96} />
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>6. Real-World Usage in Components</h2>

        <h3>Navbar/Header:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {`<Avatar 
  src={user.photoUrl} 
  name={user.fullName} 
  size={40} 
/>`}
        </pre>

        <h3>User Profile:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {`<Avatar 
  src={currentUser.profileImage} 
  name={currentUser.displayName} 
  size={96} 
/>`}
        </pre>

        <h3>Comment Section:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {`comments.map(comment => (
  <div key={comment.id}>
    <Avatar 
      src={comment.author.avatar} 
      name={comment.author.name} 
      size={32} 
    />
    <p>{comment.text}</p>
  </div>
))`}
        </pre>

        <h3>User List:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {`<Avatar 
  src={participant.image} 
  name={participant.firstName + ' ' + participant.lastName} 
  size={48} 
/>`}
        </pre>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>7. Unique Initials for Different Names</h2>
        <p>Each name generates a unique avatar:</p>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar src={undefined} name="Alex Morgan" size={56} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Alex Morgan</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Avatar src={undefined} name="Emma Watson" size={56} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Emma Watson</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Avatar src={undefined} name="Michael Chen" size={56} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Michael Chen</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Avatar src={undefined} name="Sarah Ahmed" size={56} />
            <div style={{ fontSize: '12px', marginTop: '5px' }}>Sarah Ahmed</div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Key Features</h2>
        <ul>
          <li>✅ Handles null, undefined, and empty strings gracefully</li>
          <li>✅ Automatic fallback on image load errors</li>
          <li>✅ Prevents infinite onError loops</li>
          <li>✅ Fully responsive with customizable size</li>
          <li>✅ Circular shape with object-fit: cover</li>
          <li>✅ Generates unique initials from user names</li>
          <li>✅ No external dependencies (except DiceBear API)</li>
          <li>✅ TypeScript support with proper types</li>
        </ul>
      </section>
    </div>
  );
};

export default AvatarExamples;
