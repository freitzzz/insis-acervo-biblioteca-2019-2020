using System.Linq;
using System.Collections.Generic;
using GestaoReservasQuery.Model;
using Microsoft.EntityFrameworkCore;

namespace GestaoReservasQuery.Repositories
{
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly GestaoReservasQueryContext _dbContext;

        protected Repository(GestaoReservasQueryContext dbContext)
        {
            _dbContext = dbContext;
        }

        /*
         * Returns all entities of type T that are active or not, in an object that implements interface IQueryable.
         * Prefered method when there is a need to include attributes that are "lazy".
         */
        protected IQueryable<T> GetQueryable()
        {
            return _dbContext.Set<T>();
        }

        /*
         * Not currently being used.
         */
        protected IEnumerable<T> GetQueryable(ISpecification<T> spec)
        {
            return _dbContext.Set<T>()
            .AsEnumerable()
                // .Include(spec.Include)
                .Where(spec.Criteria.Compile());
        }

        /*
        * Gets the entity with the given database ID.
        */
        public virtual T GetById(long id)
        {
            return _dbContext.Set<T>().FirstOrDefault(e => e.Id == id);
        }

        /*
         * Returns all entities of type T that are active in the form of List<T>. 
         * Method to be overriden when in need to retrieve all categories including additional "lazy" atributtes.
         */
        public virtual List<T> List()
        {
            return this.GetQueryable().ToList();
        }

        /*
         * Not currently being used.
         */
        public List<T> List(ISpecification<T> spec)
        {
            return this.GetQueryable(spec).ToList();
        }

        /*
         * Creates the passed entity in the DB.
         */
        public T Add(T entity)
        {
            // entity.Version = 1;
            _dbContext.Set<T>().Add(entity);
            _dbContext.SaveChanges();
            return entity;
        }

        /*
         * "Deactivates" the passed entity. (Soft delete)
         */
        public virtual T Delete(T entity)
        {
            // entity.State = false;
            return Update(entity);
            // _dbContext.Set<T>().Remove(entity);
            // _dbContext.SaveChanges();
            // return entity;
        }

        /*
         * Updates the passed entity.
         */
        public T Update(T entity)
        {
            
            // _dbContext.Entry(entity).State = EntityState.Modified;

            _dbContext.SaveChanges();
            return entity;
        }
    }
}