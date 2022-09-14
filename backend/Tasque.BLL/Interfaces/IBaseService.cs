namespace Tasque.Core.BLL.Interfaces
{
    public interface IBaseService<TCreateDto, TInfoDto, TUpdateDto, TKey>
    {
        Task<TInfoDto> Create(TCreateDto createDto);
        Task<TInfoDto> Update(TKey key, TUpdateDto updateDto);
        Task<TInfoDto> GetByKey(TKey key);
        Task<bool> Delete(TKey key);
    }
}
